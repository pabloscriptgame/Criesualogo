<?php
$dir = __DIR__ . DIRECTORY_SEPARATOR . "musicas" . DIRECTORY_SEPARATOR;
if (!file_exists($dir)) {
  echo "Pasta não existe: " . $dir;
  exit;
}
$testFile = $dir . "perm_test_" . uniqid() . ".txt";
$ok = @file_put_contents($testFile, "test");
if ($ok === false) {
  echo "NÃO CONSEGUIU ESCREVER na pasta musicas/. Verifique permissões (775/755).";
} else {
  echo "OK: Conseguiu escrever na pasta musicas/. Arquivo criado: " . basename($testFile);
}
