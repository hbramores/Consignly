<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
    <h2>Login</h2>
    <form action="actions/login_action.php" method="POST">
        <input type="text" name="username" placeholder="Username" required autocomplete="on"><br><br>
        <input type="password" name="password" placeholder="Password" required><br><br>
        <button type="submit">Login</button><br><br>
        <a href="register.php">Create an account</a>
    </form>
</body>
</html>