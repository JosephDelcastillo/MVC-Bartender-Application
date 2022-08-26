<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @property Ion_auth|Ion_auth_model    $ion_auth           The ION Auth spark
 * @property CI_Form_validation         $form_validation    The form validation library
 * @property CI_DB_query_builder        $db                 The Database Query Helper
 * @property Data_model                 $data_model         The Data Model
 * @property CI_Config                  $config             The Language Handler
 * @property CI_Upload                  $upload             The Upload Helper
 * @property CI_Input                   $input              The Input Handler
 * @property CI_Lang                    $lang               The Language Handler
 */
class Data extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper(['url', 'language']);
        $this->load->library(['ion_auth', 'form_validation', 'upload']);
        $this->load->model('data_model');
        $this->lang->load('auth');

        $this->upload_path = realpath(APPPATH . '../uploads');
        $uploadConfig = [
            'upload_path' => realpath(APPPATH . '../uploads'),
            'allowed_types' => 'jpg|jpeg|gif|png|pdf',
            'overwrite' => true,
        ];
        $this->upload->initialize($uploadConfig);
    }

    /********************** AJAX ENDPOINTS - START **********************/
    //------ View ------
    public function GetOrderProducts() {
        $auth = $this->data_model->has_authorization_to($this->data_model::AUTH_ACTIONS['View'], $this->data_model::AUTH_ENTITIES['Orders']);
        if($auth['Success']){
            $response = ['Success' => false];

            if (empty($this->input->post('name'))) {
                $response['Message'] = 'Missing Customer Name';
            } else {
                $name = $this->input->post('name');

                $q = $this->data_model->LoadOrderProducts($name);

                $response['Success'] = true;
                $response['data'] = $q;
            }
            echo json_encode($response);
            return $response['Success'];
        } else {
            echo json_encode($auth);
            return false;
        }
    }

    //------ Add -------
    public function AddProduct() {
        $auth = $this->data_model->has_authorization_to($this->data_model::AUTH_ACTIONS['Modify'], $this->data_model::AUTH_ENTITIES['Products']);
        if($auth['Success']){
            $response = ['Success' => false];

            if (empty($this->input->post('name')) || empty($this->input->post('price'))) {
                $response['Message'] = 'Missing Name or Price';
            } else {
                $name = $this->input->post('name');
                $description = $this->input->post('description');
                $price = $this->input->post('price');
                $data = [
                    'name' => $name,
                    'description' => $description,
                    'price' => $price
                ];
                $q = $this->data_model->AddToTable($this->data_model::TABLES['Products'], $data);

                $response['Success'] = true;
                $response['data'] = $q;
            }
            echo json_encode($response);
            return $response['Success'];
        } else {
            echo json_encode($auth);
            return false;
        }
    }

    public function AddOrder() {
        $auth = $this->data_model->has_authorization_to($this->data_model::AUTH_ACTIONS['View'], $this->data_model::AUTH_ENTITIES['Products']);
        if($auth['Success']){
            $response = ['Success' => false];

            if (empty($this->input->post('name')) || empty($this->input->post('products'))) {
                $response['Message'] = 'Missing Name or Products';
            } else {
                $name = strtolower($this->input->post('name'));
                $products = $this->input->post('products');
                $prods = array_filter(explode(',', $products));

                $data = ['customer' => $name];
                $worked = true;
                $fails = [];

                foreach ($prods as $product) {
                    $data['product_id'] = $product;
                    if(!$this->data_model->AddToTable($this->data_model::TABLES['Orders'], $data)) {
                        $worked = false;
                        $fails[] = $product;
                    }
                }

                $response['Success'] = $worked;
                $response['data'] = $worked ? $data['customer'] : $fails;
            }
            echo json_encode($response);
            return $response['Success'];
        } else {
            echo json_encode($auth);
            return false;
        }
    }

    //------ Edit ------
    public function EditOrderProgress () {
        $auth = $this->data_model->has_authorization_to($this->data_model::AUTH_ACTIONS['Manage'], $this->data_model::AUTH_ENTITIES['Orders']);
        if($auth['Success']){
            $response = ['Success' => false];
            if (empty($this->input->post('id')) || ($this->input->post('ready') != 0 && $this->input->post('ready') != 1)) {
                $response['Message'] = 'Missing ID or Progress';
            } else {
                $id = $this->input->post('id');
                $ready = $this->input->post('ready');

                $data = [ 'ready' => $ready ];

                if($this->data_model->EditTableData($this->data_model::TABLES['Orders'], $data, $id)) {
                    $response['Success'] = true;
                }
                $response['data'] = [ 'id' => $id, 'ready' => $ready ];
            }
            echo json_encode($response);
            return $response['Success'];
        } else {
            echo json_encode($auth);
            return false;
        }
    }

    //----- Delete -----

    /*********************** AJAX ENDPOINTS - END ***********************/

    //------ Validation ------
    private function ValidateFieldList ($fieldList) {
        $valid = true; $validationErrors = [];
        foreach ($fieldList as $field) {
            $validationData = $this->ValidateField($this->input->post($field['id']), $field['type'], $field['name'], $field['max'], $field['required']);
            if(!$validationData['valid']) {
                $valid = false;
                $validationErrors[] = ['id' => $field['id'], 'data' => $validationData['data']];
            }
        }
        return ['valid' => $valid, 'errorsData' => $validationErrors];
    }

    private function ValidateField($value, string $type, string $name, int $max, bool $required = false) : array {
        if(empty($value)) return ['valid' => ($required !== true), 'data' => $name.' required.'];
        if(strlen($value) > $max) return ['valid' => false, 'data' => "{$name} Cannot Exceed {$max} Characters"];
        return match (strtolower($type)) {
            'email' => $this->validateEmail($value, $name),
            'alpha' => $this->validateAlphaSpaces($value, $name),
            'numeric' => $this->validateNumbersSpaces($value, $name),
            'alphanumeric' => $this->validateAlphaNumbers($value, $name),
            default => ['valid' => true],
        };
    }

    private function validateNumbersSpaces($value, $name) : array {
        if(preg_match('/[^0-9 ]/i', $value)) return ['valid' => false, 'data' => "{$name} Must Be Numbers and Spaces only"];
        return ['valid' => true];
    }

    private function validateAlphaSpaces($value, $name) : array {
        if(preg_match('/[^a-zA-Z \n]+/', $value)) return ['valid' => false, 'data' => "{$name} Must Be Letters and Spaces only"];
        return ['valid' => true];
    }

    private function validateAlphaNumbers($value, $name) : array {
        if(preg_match('/[^a-zA-Z0-9 \n]+/', $value)) return ['valid' => false, 'data' => "{$name} Must Be Letters, Numbers, and Spaces only"];
        return ['valid' => true];
    }

    private function validateEmail($value, $name) : array {
        if(!filter_var($value, FILTER_VALIDATE_EMAIL)) return ['valid' => false, 'data' => "{$name} Must Be A Valid Email (Ex: email@domain.com)"];
        return ['valid' => true];
    }
}