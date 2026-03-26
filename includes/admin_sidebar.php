<div class="sidebar">
    <div class="logo">
        <img src="#" alt="logo">
        Consignly
    </div>

    <div class="menu-title">Menu</div>
    <div class="nav">
        <a href="../dashboard.php" class="nav-item">
            <img src="#" alt="dashboard icon">
            <span>Dashboard</span>
        </a>

        <a href="index.php" class="nav-item active">
            <img src="#" alt="products icon">
            <span>Products</span>
        </a>

        <a href="../stock/index.php" class="nav-item">
            <img src="#" alt="stocks icon">
            <span>Stocks</span>
        </a>

        <a href="../shops/index.php" class="nav-item">
            <img src="#" alt="shops icon">
            <span>Shops</span>
        </a>

        <a href="../reports/index.php" class="nav-item">
            <img src="#" alt="reports icon">
            <span>Reports</span>
        </a>
    </div>

    <hr>

    <div class="profile-label">Profile</div>
    <div class="profile">
        <img src="#" alt="Profile Picture">
        <p><?php echo $_SESSION['user']; ?></p>
        <a href="../../logout.php">Logout</a>
    </div>
</div>