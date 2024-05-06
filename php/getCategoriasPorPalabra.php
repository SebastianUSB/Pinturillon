<?php
include 'conexion.php';

$id_palabra = $_POST['id_palabra'] ?? '';

if ($id_palabra) {
    $query = "SELECT c.id_categoria, c.nombre FROM categoria c
              JOIN palabras_por_categoria pc ON c.id_categoria = pc.id_categoria
              WHERE pc.id_palabra = ?";
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("i", $id_palabra);
        $stmt->execute();
        $result = $stmt->get_result();
        $categorias = [];
        while ($row = $result->fetch_assoc()) {
            $categorias[] = $row;
        }
        echo json_encode($categorias);
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error al preparar la consulta: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID de palabra no proporcionado"]);
}
$conn->close();
?>