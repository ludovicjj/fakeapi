<?php
require '_inc.php';
?>
    <!doctype html>
    <html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <title>Ajax</title>

    <!-- CSS only -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
          integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
          crossorigin="anonymous"
    >
    <style>
        body {
            padding-top: 5rem;
        }
        .starter-template {
            padding: 3rem 1.5rem;
        }
    </style>
</head>
<body>
<nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
        </ul>
    </div>
</nav>

<main role="main" class="container">

    <div class="starter-template">

        <?php if (array_key_exists('errors', $_SESSION)) : ?>
            <div class="alert alert-danger">
                <?= implode('<br>', $_SESSION['errors']); ?>
            </div>

        <?php endif; ?>
        <?php if (array_key_exists('success', $_SESSION)) : ?>
            <div class="alert alert-success">
                Votre message a bien été envoyé.
            </div>
        <?php endif; ?>

        <form action="contact.php" method="POST" id="contact">
            <?php $form = new Form($_SESSION['input'] ?? []); ?>
            <div class="row">
                <div class="col-sm-4">
                    <?= $form->text('name', 'Votre nom'); ?>
                </div>
                <div class="col-sm-4">
                    <?= $form->email('email', 'Votre email'); ?>
                </div>
                <div class="col-sm-4">
                    <?= $form->select('service', 'Service', ['Gmail', 'Laposte']); ?>
                </div>
                <div class="col-sm-12">
                    <?= $form->textarea('message', 'Message'); ?>
                </div>
                <div class="col-sm-12">
                    <?= $form->submit('Envoyer'); ?>
                </div>
            </div><!-- .row -->
        </form>
        <h2 class="mt-4">Debug :</h2>
        <?php var_dump($_SESSION); ?>
    </div>

</main><!-- /.container -->

<!-- JS, Popper.js, and jQuery -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
<script src="app.js"></script>
</body>

<?php
unset($_SESSION['errors']);
unset($_SESSION['input']);
unset($_SESSION['success']);
?>