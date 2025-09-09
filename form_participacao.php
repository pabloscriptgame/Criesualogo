<?php
// form_participacao.php
// Página HTML + PHP para enviar participação e comprovante

$mensagem = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $url = 'save_and_zip.php';

    // Enviar via cURL para o save_and_zip.php
    $ch = curl_init();
    $cfile = new CURLFile($_FILES['file']['tmp_name'], $_FILES['file']['type'], $_FILES['file']['name']);

    $data = [
        'nome'   => $_POST['nome'],
        'whats'  => $_POST['whats'],
        'numero' => $_POST['numero'],
        'file'   => $cfile
    ];

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code == 200) {
        $mensagem = "Participação enviada com sucesso!";
    } else {
        $mensagem = "Erro ao enviar: " . htmlspecialchars($response);
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Enviar Participação</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; }
    .container { max-width: 500px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 8px rgba(0,0,0,0.1); }
    input, button { width: 100%; padding: 10px; margin-top: 10px; }
    button { background: #28a745; color: white; border: none; cursor: pointer; }
    button:hover { background: #218838; }
    .mensagem { margin-top: 15px; padding: 10px; border-radius: 5px; }
    .sucesso { background: #d4edda; color: #155724; }
    .erro { background: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Cadastro de Participação</h2>
    <form method="POST" enctype="multipart/form-data">
      <label for="nome">Nome completo:</label>
      <input type="text" id="nome" name="nome" required>

      <label for="whats">WhatsApp:</label>
      <input type="text" id="whats" name="whats" placeholder="(DDD) 99999-9999" required>

      <label for="numero">Número da sorte:</label>
      <input type="number" id="numero" name="numero" min="1" required>

      <label for="file">Anexe o comprovante (imagem ou PDF):</label>
      <input type="file" id="file" name="file" accept=".jpg,.jpeg,.png,.gif,.pdf" required>

      <button type="submit">Enviar</button>
    </form>

    <?php if ($mensagem): ?>
      <div class="mensagem <?= strpos($mensagem, 'sucesso') !== false ? 'sucesso' : 'erro' ?>">
        <?= htmlspecialchars($mensagem) ?>
      </div>
    <?php endif; ?>
  </div>
</body>
</html>
