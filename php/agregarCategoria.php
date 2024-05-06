<?php
include 'conexion.php';

$nombreCategoria = $_POST['agregarCategoria'] ?? '';

if ($stmt = $conn->prepare("SELECT id_categoria FROM categoria WHERE nombre = ?")) {
    $stmt->bind_param("s", $nombreCategoria);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "La categoría ya existe"]);
    } else {
        // Si no existe, realizar la inserción
        if ($stmt = $conn->prepare("INSERT INTO categoria (nombre) VALUES (?)")) {
            $stmt->bind_param("s", $nombreCategoria);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                echo json_encode(["success" => true, "message" => "Categoría agregada con éxito"]);
            } else {
                echo json_encode(["success" => false, "message" => "No se pudo agregar la categoría"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Error de preparación de consulta: " . $conn->error]);
        }
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Error de preparación de consulta: " . $conn->error]);
}
$conn->close();
?>