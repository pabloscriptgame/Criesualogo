<?php
// salvar.php - responsável por salvar os dados e comprovantes enviados via formulário
date_default_timezone_set('America/Sao_Paulo');

header('Content-Type: application/json; charset=utf-8');

$uploadsDir = __DIR__ . "/uploads/";
$participacoesDir = __DIR__ . "/participacoes/";

if (!is_dir($uploadsDir)) mkdir($uploadsDir, 0777, true);
if (!is_dir($participacoesDir)) mkdir($participacoesDir, 0777, true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(['status' => 'erro', 'msg' => 'Método inválido.']);
  exit;
}

$nome = trim($_POST['nome'] ?? '');
$whats = trim($_POST['whats'] ?? '');
$numero = intval($_POST['numero'] ?? 0);

if ($nome === '' || $whats === '' || $numero <= 0) {
  echo json_encode(['status' => 'erro', 'msg' => 'Preencha todos os campos corretamente.']);
  exit;
}

// Pasta específica para o número
$numeroPasta = $participacoesDir . $numero . "/";
if (!is_dir($numeroPasta)) mkdir($numeroPasta, 0777, true);

// Validar e mover comprovante
$arquivo = $_FILES['file'] ?? null;
if (!$arquivo || $arquivo['error'] !== UPLOAD_ERR_OK) {
  echo json_encode(['status' => 'erro', 'msg' => 'Erro no upload do comprovante.']);
  exit;
}

$ext = strtolower(pathinfo($arquivo['name'], PATHINFO_EXTENSION));
$nomeArquivo = uniqid("comp_") . "." . $ext;
if (!move_uploaded_file($arquivo['tmp_name'], $uploadsDir . $nomeArquivo)) {
  echo json_encode(['status' => 'erro', 'msg' => 'Falha ao mover o arquivo.']);
  exit;
}

// Dados salvos em JSON
$dados = [
  'ref' => 'P' . base_convert(time(), 10, 36),
  'nome' => $nome,
  'whats' => $whats,
  'numero' => $numero,
  'comprovante' => 'uploads/' . $nomeArquivo,
  'status' => 'reservado',
  'data' => date('Y-m-d H:i:s')
];

file_put_contents($numeroPasta . "dados.json", json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(['status' => 'ok', 'msg' => 'Participação salva com sucesso!', 'dados' => $dados]);
?>
