<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ScrollSpy</title>
    <link rel="stylesheet" href="css/app.css">
</head>
<body>
<nav>
    <?php for($i=0; $i < 4; $i++): ?>
        <a href="#section<?= $i ?>">Section <?= $i ?></a>
    <?php endfor; ?>
    <a href="#">Contact</a>
</nav>
<main>
    <?php for($i=0; $i < 4; $i++): ?>
        <section id="section<?= $i ?>">
            section <?= $i ?>
        </section>
    <?php endfor; ?>
</main>
</body>
</html>