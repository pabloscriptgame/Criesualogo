<?php
header('Content-Type: application/json; charset=utf-8');

$dir = __DIR__ . DIRECTORY_SEPARATOR . "musicas" . DIRECTORY_SEPARATOR;
$baseUrl = "musicas/";

// Se a pasta não existir, cria
if (!file_exists($dir)) {
    mkdir($dir, 0775, true);
}

$arquivos = array_diff(@scandir($dir), array('..', '.', '.gitkeep'));
$musicas = [];

foreach ($arquivos as $a) {
    $path = $dir . $a;
    if (!is_file($path)) continue;

    $ext = strtolower(pathinfo($a, PATHINFO_EXTENSION));
    // apenas extensões de áudio comuns
    $permitidas = ['mp3','wav','ogg','flac','m4a','aac','wma'];
    if (!in_array($ext, $permitidas)) continue;

    $musicas[] = [
        "nome" => $a,
        "url" => $baseUrl . rawurlencode($a),
        "size" => filesize($path),
        "mtime" => filemtime($path)
    ];
}

echo json_encode(array_values($musicas));
