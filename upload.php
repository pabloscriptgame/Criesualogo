<?php
// JSON helper
function respond($ok, $msg, $extra = []) {
    header('Content-Type: application/json; charset=utf-8');
    $out = array_merge(['ok'=>$ok, 'msg'=>$msg], $extra);
    echo json_encode($out);
    exit;
}

// Mapeia erros do PHP para mensagens amigáveis
function upload_error_msg($code) {
    switch ($code) {
        case UPLOAD_ERR_INI_SIZE: return 'Arquivo maior que upload_max_filesize do servidor.';
        case UPLOAD_ERR_FORM_SIZE: return 'Arquivo maior que o limite do formulário (MAX_FILE_SIZE).';
        case UPLOAD_ERR_PARTIAL: return 'Upload parcial (interrompido).';
        case UPLOAD_ERR_NO_FILE: return 'Nenhum arquivo enviado.';
        case UPLOAD_ERR_NO_TMP_DIR: return 'Pasta temporária ausente no servidor.';
        case UPLOAD_ERR_CANT_WRITE: return 'Falha ao gravar no disco do servidor.';
        case UPLOAD_ERR_EXTENSION: return 'Upload bloqueado por extensão do PHP.';
        default: return 'Erro desconhecido no upload.';
    }
}

// Valida cabeçalho simples (assinatura) para alguns formatos comuns
function sniff_audio_signature($path) {
    $fh = @fopen($path, 'rb');
    if (!$fh) return null;
    $sig = fread($fh, 12);
    fclose($fh);
    if (strncmp($sig, "ID3", 3) === 0) return 'mp3';
    if (strncmp($sig, "OggS", 4) === 0) return 'ogg';
    if (strncmp($sig, "fLaC", 4) === 0) return 'flac';
    if (strncmp($sig, "RIFF", 4) === 0 && substr($sig, 8, 4) === "WAVE") return 'wav';
    // M4A/AAC dentro de contêiner MP4 ('ftyp')
    if (substr($sig, 4, 4) === "ftyp") return 'm4a';
    return null;
}

// Início
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    respond(false, 'Método não permitido');
}

$targetDir = __DIR__ . DIRECTORY_SEPARATOR . "musicas" . DIRECTORY_SEPARATOR;
if (!file_exists($targetDir) && !@mkdir($targetDir, 0775, true)) {
    respond(false, 'Não foi possível criar a pasta de destino (permissões).', ['dir'=>$targetDir]);
}
if (!is_writable($targetDir)) {
    respond(false, 'A pasta musicas/ não é gravável. Ajuste as permissões para 775 ou 755.', ['dir'=>$targetDir]);
}

if (!isset($_FILES['musica'])) {
    respond(false, 'Nenhum arquivo enviado.');
}
$file = $_FILES['musica'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    respond(false, upload_error_msg($file['error']), ['php_error'=>$file['error']]);
}

// Limites
$maxSize = 64 * 1024 * 1024; // 64MB
if ($file['size'] > $maxSize) {
    respond(false, 'Arquivo excede 64MB.');
}

// Tipos permitidos
$allowed_exts = ['mp3','wav','ogg','flac','m4a','aac','wma'];
$allowed_mimes = [
    'audio/mpeg'=>'mp3','audio/mp3'=>'mp3',
    'audio/wav'=>'wav','audio/x-wav'=>'wav',
    'audio/ogg'=>'ogg',
    'audio/flac'=>'flac',
    'audio/aac'=>'aac',
    'audio/mp4'=>'m4a','audio/m4a'=>'m4a',
    'audio/x-ms-wma'=>'wma',
];

// Descobre extensão por MIME quando possível
$ext = null;
if (function_exists('finfo_open')) {
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime  = $finfo->file($file['tmp_name']);
    if (isset($allowed_mimes[$mime])) $ext = $allowed_mimes[$mime];
}

// Se não encontrou via MIME, tenta assinatura ou extensão original
if (!$ext) {
    $sniff = sniff_audio_signature($file['tmp_name']);
    if ($sniff && in_array($sniff, $allowed_exts, true)) {
        $ext = $sniff;
    } else {
        $origExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (in_array($origExt, $allowed_exts, true)) $ext = $origExt;
    }
}

if (!$ext) {
    respond(false, 'Formato de áudio não permitido ou não reconhecido.');
}

// Nome final
$origName = pathinfo($file['name'], PATHINFO_FILENAME);
$origName = preg_replace('/[^a-zA-Z0-9-_ ]+/', '', $origName);
$finalName = ($origName ? substr($origName, 0, 80) : 'musica') . '-' . uniqid() . '.' . $ext;
$dest = $targetDir . $finalName;

// Move
if (!@move_uploaded_file($file['tmp_name'], $dest)) {
    respond(false, 'Falha ao salvar o arquivo (permissões/space).');
}

// Ajusta permissão do arquivo (opcional)
@chmod($dest, 0664);

respond(true, 'Upload realizado com sucesso', [
    'file'=>['nome'=>$finalName, 'url'=>'musicas/' . rawurlencode($finalName)]
]);
