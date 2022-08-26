<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>
<?php include('components/header.php'); ?>

<body class="d-flex h-100 align-items-center">

    <!-- body content -->
    <div class="container">
        <div class="card text-bg-dark m-2">
            <div class="card-header text-center">
                <h1> Menu </h1>
            </div>

            <div class="card-body">
            <?php if ( empty($products) ) : ?>
                <h2>
                    The Menu Is Currently Empty, Please Look back in later
                </h2>
            <?php else : ?>
                <input type="hidden" name="order" value="">

                <ul class="list-group list-group-flush mb-3">
                <?php foreach($products AS $product) : ?>
                    <li class="list-group-item list-group-item-action" id="<?=$product['id']?>" onclick="BARTENDER.Order.AddToCart(<?=$product['id']?>)">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1"><?=$product['id']?>. <?=$product['name']?></h5>
                            <small>$<?=$product['price']?>ea</small>
                        </div>
                        <p class="mb-1 ps-5"><?=$product['description']?></p>
                    </li>
                <?php endforeach; ?>
                </ul>
                <div class="btn btn-outline-success d-none w-100" onclick="BARTENDER.Order.SubmitCart()" id="submitOrderBtn">Submit Order</div>
            <?php endif; ?>
            </div>
        </div>

    </div>

</body>

<?php include('components/footer.php'); ?>