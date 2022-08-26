<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>
<?php $user_role = empty($user_role) ? 0 : $user_role; ?>

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
                <h1> Dashboard </h1>
            </div>

            <div class="card-body">
                <div class="row fs-5">
                    <div class="col-12 text-decoration-none link-light fw-semibold mb-3">
                        Role - <?=ucwords(strtolower($user_role))?>
                    </div>
                    <div class="col-2"></div>
                    <a class="col-8 btn btn-secondary py-5 mb-3" href="<?=base_url('/dashboard/orders')?>">Go To Order Queue</a>
                </div>
            </div>
        </div>
    </div>

</div>