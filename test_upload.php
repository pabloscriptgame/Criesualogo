<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dest = __DIR__ . '/uploads/comprovantes/' . basename($_FILES['file']['name']);
    if (move_uploaded_file($_FILES['file']['tmp_name'], $dest)) {
        echo "Arquivo enviado com sucesso: " . $dest;
    } else {
        echo "Falha ao mover arquivo.";
    }
}
?>
<form method="POST" enctype="multipart/form-data">
    <input type="file" name="file">
    <button type="submit">Enviar</button>
</form>
