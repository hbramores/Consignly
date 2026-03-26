<!--------------------------------------------->
<?php
session_start();

if (!isset($_SESSION['user'])) {
    header("Location: ../../login.php");
    exit();
}

include '../../includes/db.php';

$sql = "SELECT * FROM products";
$result = mysqli_query($conn, $sql);
?>
<!--------------------------------------------->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products</title>
    <!-- Style sheets -->
    <link rel="stylesheet" href="../../assets/css/base.css">
    <link rel="stylesheet" href="../../assets/css/layout.css">
    <link rel="stylesheet" href="../../assets/css/sidebar.css">
    <link rel="stylesheet" href="../../assets/css/components.css">
    <link rel="stylesheet" href="../../assets/css/products.css">
</head>
<body class="page-layout">
    <?php include '../../includes/admin_sidebar.php'; ?>

    <main class="main-content">
        <section class="page-header">
            <div class="page-header-text">
                <h1 class="page-title">Products</h1>
                <p class="page-subtitle">Manage your product inventory</p>
            </div>
            <button class="btn add-product-btn">
                <img src="#" alt="add-product-icon">
                <span>Add Product</span>
            </button>
            
        </section >
            
        <section class="toolbar">
            <!-- Filter options will go here it needs to access the database for filtering products -->
            <button class="btn filter-btn">
                <span>Filter</span>
                <img src="#" alt="filter-icon">
            </button>

            <input type="text" class="filter" placeholder="Search products">
            <button class="btn-outline">Sort</button>
        </section>

        <section class="product-grid">
            <!-- Product card will populate here -->
        </section>

    </main>
        
        
   


</body>
</html>