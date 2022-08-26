<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>
<?php $user_role = empty($user_role) ? 0 : $user_role; ?>
<?php $products = empty($products) ? $this->Data_model->loadProducts() : $products; ?>

<body style="height: 100%">
<!-- body content -->
<div class="text-bg-secondary text-center h-100 w-100 row">
    <div class="col-2 pe-0">
        <?php include ('menu-sidebar.php') ?>
    </div>
    <div class="col-10">
        <!-- Testing Area -->
        <div class="card text-bg-dark text-light m-2">
            <div class="card-header">
                <h1> Products </h1>
            </div>

            <div class="card-body">
                <table class="table table-dark table-striped">
                    <thead class="table-light">
                        <tr>
                            <th scope="col"> ID </th>
                            <th scope="col"> Name </th>
                            <th scope="col"> Description </th>
                            <th scope="col"> Price </th>
                            <th scope="col"> Actions </th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php if( count($products) > 0 ) : ?>
                        <?php foreach($products AS $product) : ?>
                        <tr>
                            <td> <?=$product['id']?> </th>
                            <td> <?=$product['name']?> </th>
                            <td> <?=$product['description']?> </th>
                            <td> $<?=$product['price']?> </th>
                            <td> No Actions </th>
                        </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                        <tr>
                            <td colspan="5">
                                <div class="btn btn-outline-primary w-100" onclick="BARTENDER.Products.Add();">Add Product</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</div>