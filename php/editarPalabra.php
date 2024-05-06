<?php
include 'conexion.php';

$id_palabra = $_POST['id_palabra'] ?? '';
$nueva_palabra = $_POST['nueva_palabra'] ?? '';

if ($id_palabra && $nueva_palabra) {
    if ($stmt = $conn->prepare("UPDATE palabra SET texto = ? WHERE id_palabra = ?")) {
        $stmt->bind_param("si", $nueva_palabra, $id_palabra);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Palabra actualizada con éxito"]);
        } else {
            echo json_encode(["success" => false, "message" => "No se realizó ningún cambio"]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error al preparar la consulta"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
}
$conn->close();
?>