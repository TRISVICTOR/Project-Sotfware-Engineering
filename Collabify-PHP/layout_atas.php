<?php

if(!isset($conn)){
    http_response_code(404);
    exit();
}
?>
<!doctype html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($judulHalaman) ?> | collabify</title>

    <!-- CSS asli React. Urutannya SAMA dengan bundel Vite (main.jsx lalu App.jsx),
         karena class seperti .sidebar dan .input-group dipakai bersama:
         file yang dimuat belakangan menimpa yang lebih awal. Jangan diubah urutannya. -->
    <link rel="stylesheet" href="assets/css/index.css">
    <link rel="stylesheet" href="assets/css/PageAwal.css">
    <link rel="stylesheet" href="assets/css/LoginPage.css">
    <link rel="stylesheet" href="assets/css/SignUpPage.css">
    <link rel="stylesheet" href="assets/css/HomePage.css">
    <link rel="stylesheet" href="assets/css/MyTaskPage.css">
    <link rel="stylesheet" href="assets/css/FriendPage.css">
    <link rel="stylesheet" href="assets/css/AddTaskPage.css">
    <link rel="stylesheet" href="assets/css/AddFriendPage.css">
    <link rel="stylesheet" href="assets/css/AssignmentTaskIfAGroupProject.css">
    <link rel="stylesheet" href="assets/css/ProfilePage.css">
    <link rel="stylesheet" href="assets/css/ChangePasswordPage.css">
    <link rel="stylesheet" href="assets/css/ChangeUsernameEmailPage.css">
    <link rel="stylesheet" href="assets/css/InformationPage.css">
    <!-- Tambahan versi PHP, selalu paling akhir.
         ?v= waktu terakhir file diubah: kalau file diubah, URL-nya berubah sehingga
         browser wajib mengunduh ulang (tidak memakai versi lama dari cache). -->
    <link rel="stylesheet" href="assets/css/collabify-php.css?v=<?= filemtime(__DIR__ . "/assets/css/collabify-php.css") ?>">
</head>
<body>
<div id="root">
