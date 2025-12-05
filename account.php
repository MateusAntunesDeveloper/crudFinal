<?php
session_start();
require_once 'database.php';

header('Content-Type: application/json');

// Recebe dados JSON
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

$response = ['sucesso' => false];

switch($action) {

    case 'getUserData':
        if(!isset($_SESSION['user_id'])){
            $response['erro'] = 'Usuário não logado';
            break;
        }
        $userId = $_SESSION['user_id'];

        // Pegar dados do usuário
        $stmt = $pdo->prepare("SELECT nome, email FROM usuarios WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Pegar pedidos do usuário
        $stmt2 = $pdo->prepare("SELECT id, DATE_FORMAT(data,'%d/%m/%Y') AS data, status, total FROM pedidos WHERE usuario_id = ? ORDER BY data DESC");
        $stmt2->execute([$userId]);
        $pedidos = $stmt2->fetchAll(PDO::FETCH_ASSOC);

        $response = [
            'sucesso' => true,
            'nome' => $user['nome'],
            'email' => $user['email'],
            'pedidos' => $pedidos
        ];
        break;

    case 'logout':
        session_destroy();
        $response['sucesso'] = true;
        break;

    case 'deleteAccount':
        if(!isset($_SESSION['user_id'])){
            $response['erro'] = 'Usuário não logado';
            break;
        }
        $userId = $_SESSION['user_id'];

        // Deletar pedidos
        $stmt = $pdo->prepare("DELETE FROM pedidos WHERE usuario_id = ?");
        $stmt->execute([$userId]);

        // Deletar usuário
        $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id = ?");
        $stmt->execute([$userId]);

        session_destroy();
        $response['sucesso'] = true;
        break;

    default:
        $response['erro'] = 'Ação inválida';
        break;
}

echo json_encode($response);
