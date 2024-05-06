<?php
ini_set('display_errors', 0);
header('Content-Type: application/json');

include 'conexion.php';

// Se recibe la palabra del formulario
$agregarPalabra = $_POST['agregarPalabra'] ?? '';

// Primero, verificar si la palabra ya existe en la base de datos
if ($stmt = $conn->prepare("SELECT * FROM palabra WHERE texto = ?")) {
    $stmt->bind_param("s", $agregarPalabra);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "La palabra ya existe"]);
    } else {
        // Si no existe, realizar la inserción
        if ($stmt = $conn->prepare("INSERT INTO palabra (texto) VALUES (?)")) {
            $stmt->bind_param("s", $agregarPalabra);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                echo json_encode(["success" => true, "message" => "Palabra agregada con éxito"]);
            } else {
                echo json_encode(["success" => false, "message" => "No se pudo agregar la palabra"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
        }
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}
$conn->close();
?>