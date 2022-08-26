<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>
<?php $user_role = empty($user_role) ? 0 : $user_role; ?>
<?php $orders = empty($orders) ? $this->data_model->loadOrders() : $orders; ?>

<body style="height: 100%">
<!-- body content -->
<div class="text-bg-secondary h-100 w-100 row">
    <div class="col-2 pe-0">
        <?php include ('menu-sidebar.php') ?>
    </div>
    <div class="col-10">
        <!-- Testing Area -->
        <div class="card text-bg-dark text-light m-2">
            <div class="card-header text-center">
                <h1> Orders </h1>
            </div>

            <div class="card-body">
                <?php if ( empty($orders) ) : ?>
                    <h2>
                        The Menu Is Currently Empty, Please Look back in later
                    </h2>
                <?php else : ?>
                    <input type="hidden" name="order" value="">

                    <ul class="list-group list-group-flush mb-3">
                        <?php foreach($orders AS $order) : ?>
                            <li class="list-group-item list-group-item-action<?=($order['ready'] == '0') ? '' : ' list-group-item-success'?>"
                                id="<?=$order['id']?>" onclick="BARTENDER.Order.ViewProducts('<?=$order['customer']?>')">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1"><?=$order['customer']?></h5>
                                    <small><?=($order['ready'] == '0') ? 'Not Ready' : 'Ready'?></small>
                                </div>
                                <p class="mb-1 ps-5"><?=$order['size']?> Items Ordered</p>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                    <div class="btn btn-outline-success d-none w-100" onclick="BARTENDER.Order.SubmitCart()" id="submitOrderBtn">Submit Order</div>
                <?php endif; ?>
            </div>
        </div>
    </div>

</div>