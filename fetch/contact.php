<?php
require '_inc.php';

sleep(2);

$emails = ['jahanlud@gmail.com', 'ludovicjahan@laposte.net'];

function isAjax()
{
    return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

$validator = new Validator($_POST);
$validator->check('name', 'required');
$validator->check('email', 'required');
$validator->check('email', 'email');
$validator->check('message', 'required');
$validator->check('service', 'in', array_keys($emails));
$errors = $validator->getErrors();


if (!empty($errors)) {
    if (isAjax()) {
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode($errors);
        die();
    }
    $_SESSION['errors'] = $errors;
    $_SESSION['input'] = $_POST;
    header('Location: index.php');
} else {
    if (isAjax()) {
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode(['success' => 'Votre message a bien été envoyé.']);
        die();
    }
    $_SESSION['success'] = 1;
    $message = $_POST['message'];
    $headers = "FROM: " . $_POST['email'];
    $subject = "Formulaire de contact de " . $_POST['name'];
    mail($emails[$_POST['service']], $subject, $message, $headers);
    header('Location: index.php');
}