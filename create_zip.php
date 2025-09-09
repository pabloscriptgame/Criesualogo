<?php
// create_zip.php
$dirToZip = __DIR__;
$outDir = __DIR__ . '/archives';
$zipBaseName = 'site-backup';
$downloadAfterCreate = true;

if (!extension_loaded('zip')) {
    die("Extensão ZipArchive não está habilitada no PHP.");
}
if (!is_dir($outDir)) {
    mkdir($outDir, 0755, true);
}

$timestamp = date('Ymd_His');
$zipFile = "$outDir/{$zipBaseName}_{$timestamp}.zip";

$zip = new ZipArchive();
if ($zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    die("Não foi possível criar o arquivo zip.");
}

$rootPath = realpath($dirToZip);
$files = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($rootPath),
    RecursiveIteratorIterator::LEAVES_ONLY
);

foreach ($files as $name => $file) {
    if (!$file->isDir()) {
        $filePath = $file->getRealPath();
        $relativePath = substr($filePath, strlen($rootPath) + 1);
        if (strpos($relativePath, 'archives' . DIRECTORY_SEPARATOR) === 0) continue;
        if (basename($filePath) === basename(__FILE__)) continue;
        $zip->addFile($filePath, $relativePath);
    }
}

$zip->close();

if ($downloadAfterCreate && file_exists($zipFile)) {
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="'.basename($zipFile).'"');
    header('Content-Length: ' . filesize($zipFile));
    readfile($zipFile);
    exit;
}
echo "ZIP criado: $zipFile";
?>