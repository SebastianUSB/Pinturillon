<?php
include 'conexion.php';

$id_categoria = $_POST['id_categoria'] ?? '';

if ($id_categoria) {
    if ($stmt = $conn->prepare("DELETE FROM categoria WHERE id_categoria = ?")) {
        $stmt->bind_param("i", $id_categoria);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Categoría eliminada con éxito"]);
        } else {
            echo json_encode(["success" => false, "message" => "No se pudo eliminar la categoría"]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error al preparar la consulta"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID de categoría no proporcionado"]);
}
$conn->close();
?>