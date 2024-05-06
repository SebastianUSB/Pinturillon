<?php
include 'conexion.php';

$id_sala = $_POST['id_sala'] ?? '';

if ($id_sala) {
    $stmt = $conn->prepare("DELETE FROM sala_de_juego WHERE id_sala = ?");
    $stmt->bind_param("i", $id_sala);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Sala eliminada con éxito"]);
    } else {
        echo json_encode(["success" => false, "message" => "No se pudo eliminar la sala o no existe"]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "ID de sala no proporcionado"]);
}
$conn->close();
?>

