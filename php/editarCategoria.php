<?php
include 'conexion.php';

$id_categoria = $_POST['id_categoria'] ?? '';
$nueva_categoria = $_POST['nueva_categoria'] ?? '';

if ($id_categoria && $nueva_categoria) {
    if ($stmt = $conn->prepare("UPDATE categoria SET nombre = ? WHERE id_categoria = ?")) {
        $stmt->bind_param("si", $nueva_categoria, $id_categoria);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Categoría actualizada con éxito"]);
        } else {
            echo json_encode(["success" => false, "message" => "No se realizó ningún cambio"]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error al preparar la consulta: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
}
$conn->close();
?>