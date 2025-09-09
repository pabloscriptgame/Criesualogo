<?php
// save_and_zip.php
$uploadsDir = __DIR__ . '/uploads';
$comprovDir = $uploadsDir . '/comprovantes';
$participFile = $uploadsDir . '/participacoes.json';
$archivesDir = __DIR__ . '/archives';
$allowedTypes = ['image/jpeg','image/png','image/gif','application/pdf'];

// Criar pastas se não existirem
foreach ([$uploadsDir, $comprovDir, $archivesDir] as $d) {
    if (!is_dir($d)) mkdir($d, 0755, true);
}

// Se o JSON de participações não existir, cria vazio
if (!file_exists($participFile)) {
    file_put_contents($participFile, json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Captura os dados enviados
$nome = isset($_POST['nome']) ? trim($_POST['nome']) : null;
$whats = isset($_POST['whats']) ? trim($_POST['whats']) : null;
$numero = isset($_POST['numero']) ? intval($_POST['numero']) : null;
$json = isset($_POST['json']) ? $_POST['json'] : null;

// Upload do comprovante
$comprovSaved = null;
if (!empty($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $f = $_FILES['file'];

    // Detecta tipo do arquivo
    $mime = mime_content_type($f['tmp_name']);
    if (!in_array($mime, $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error'=>'Tipo de arquivo não permitido.']);
        exit;
    }

    // Caminho final seguro
    $safeName = preg_replace('/[^a-zA-Z0-9_\.\-]/', '_', basename($f['name']));
    $targetDir = __DIR__ . '/uploads/comprovantes';

    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    $finalPath = $targetDir . '/' . time() . '_' . $safeName;

    // Tenta mover o arquivo
    if (!move_uploaded_file($f['tmp_name'], $finalPath)) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Falha ao mover arquivo para ' . $finalPath,
            'debug' => $_FILES['file']
        ]);
        exit;
    }

    // Caminho relativo salvo no JSON
    $comprovSaved = 'uploads/comprovantes/' . basename($finalPath);
}

// Carregar participações existentes
$participacoes = json_decode(file_get_contents($participFile), true);
if (!is_array($participacoes)) {
    $participacoes = [];
}

// Criar nova participação
$newEntry = null;

if ($json) {
    $entry = json_decode($json, true);
    if ($entry) {
        $newEntry = $entry;
    }
} elseif ($nome || $whats || $numero) {
    $newEntry = [
        'nome' => $nome,
        'whats' => $whats,
        'numero' => $numero
    ];
}

if ($newEntry) {
    $newEntry['id'] = count($participacoes) + 1;
    $newEntry['server_ts'] = date('c');
    $newEntry['comprovante_server'] = $comprovSaved;

    $participacoes[] = $newEntry;

    // Salvar atualizado no JSON
    file_put_contents($participFile, json_encode($participacoes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Criar ZIP com site + uploads
$zipname = $archivesDir . '/site-with-uploads_' . date('Ymd_His') . '.zip';
$zip = new ZipArchive();
if ($zip->open($zipname, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    http_response_code(500);
    echo json_encode(['error'=>'Não foi possível criar zip.']);
    exit;
}

$rootPath = realpath(__DIR__);
$files = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($rootPath),
    RecursiveIteratorIterator::LEAVES_ONLY
);

foreach ($files as $file) {
    if (!$file->isDir()) {
        $fp = $file->getRealPath();
        $rel = substr($fp, strlen($rootPath) + 1);
        if (strpos($rel, 'archives' . DIRECTORY_SEPARATOR) === 0) continue;
        $zip->addFile($fp, $rel);
    }
}
$zip->close();

// Resposta JSON
$response = [
    'status' => 'ok',
    'mensagem' => 'Participação salva e ZIP gerado com sucesso.',
    'zip' => str_replace(__DIR__.'/', '', $zipname),
    'uploads' => [
        'participacoes' => str_replace(__DIR__.'/', '', $participFile),
        'ultimo_comprovante' => $comprovSaved
    ]
];

header('Content-Type: application/json');
echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>