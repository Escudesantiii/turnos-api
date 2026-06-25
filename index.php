<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$host = getenv('MYSQLHOST');
$port = getenv('MYSQLPORT');
$db   = getenv('MYSQLDATABASE');
$user = getenv('MYSQLUSER');
$pass = getenv('MYSQLPASSWORD');

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    echo json_encode(["error" => $conn->connect_error]);
    exit;
}

$action = $_GET['action'] ?? '';

if ($action === 'medicos') {
    $result = $conn->query("SELECT * FROM medicos");
    $data = [];
    while ($row = $result->fetch_assoc()) $data[] = $row;
    echo json_encode($data);

} elseif ($action === 'turnos') {
    $medicoId = intval($_GET['medico_id'] ?? 0);
    $result = $conn->query("SELECT * FROM turnos WHERE medico_id=$medicoId AND disponible=1");
    $data = [];
    while ($row = $result->fetch_assoc()) $data[] = $row;
    echo json_encode($data);

} elseif ($action === 'reservar') {
    $turnoId = intval($_GET['turno_id'] ?? 0);
    $paciente = $conn->real_escape_string($_GET['paciente'] ?? '');
    $conn->query("INSERT INTO reservas (turno_id, paciente) VALUES ($turnoId, '$paciente')");
    $conn->query("UPDATE turnos SET disponible=0 WHERE id=$turnoId");
    echo json_encode(["ok" => true]);

} else {
    echo json_encode(["error" => "accion no valida"]);
}
?>
