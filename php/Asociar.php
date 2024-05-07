<?php
include 'conexion.php';

$id_palabra = $_POST['id_palabra'] ?? '';
$id_categoria = $_POST['id_categoria'] ?? '';

if ($id_palabra && $id_categoria) {
    // Primero verifica si la combinación ya existe para evitar duplicados
    $stmt = $conn->prepare("SELECT * FROM palabras_por_categoria WHERE id_palabra = ? AND id_categoria = ?");
    $stmt->bind_param("ii", $id_palabra, $id_categoria);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Esta asociación ya existe"]);
    } else {
        // Si no existe, inserta la nueva asociación
        $insertStmt = $conn->prepare("INSERT INTO palabras_por_categoria (id_palabra, id_categoria) VALUES (?, ?)");
        $insertStmt->bind_param("ii", $id_palabra, $id_categoria);
        $insertStmt->execute();

        if ($insertStmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Asociación creada con éxito"]);
        } else {
            echo json_encode(["success" => false, "message" => "No se pudo crear la asociación"]);
        }
        $insertStmt->close();
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
}
$conn->close();
?>