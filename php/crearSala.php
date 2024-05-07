<?php
include 'conexion.php';

$nombre_sala = $_POST['nombre_sala'] ?? '';
$id_categoria = $_POST['id_categoria'] ?? '';
<<<<<<< HEAD
$estado = 'activo';
=======
$estado = 'activo';  // Suponiendo que la sala se crea activa por defecto
>>>>>>> d72b9d4bac40dc4f9d44fc0899edf3446abfdd99

if ($nombre_sala && $id_categoria) {
    $stmt = $conn->prepare("INSERT INTO sala_de_juego (nombre, id_categoria, estado) VALUES (?, ?, ?)");
    $stmt->bind_param("sis", $nombre_sala, $id_categoria, $estado);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Sala creada con éxito"]);
    } else {
        echo json_encode(["success" => false, "message" => "No se pudo crear la sala"]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
}
$conn->close();
?>
