<?php
session_start();

class Auth {
    private $conn;
    private $table_name = "usuarios";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login($email, $password) {
        $query = "SELECT id, nome, email, senha FROM " . $this->table_name . " WHERE email = :email LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        if($stmt->rowCount() == 1) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if(password_verify($password, $row['senha'])) {
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['user_name'] = $row['nome'];
                $_SESSION['user_email'] = $row['email'];
                $_SESSION['logged_in'] = true;
                
                return true;
            }
        }
        return false;
    }

    public function isLoggedIn() {
        return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
    }

    public function logout() {
        $_SESSION = array();
        session_destroy();
    }

    public function register($nome, $email, $password) {
        // Verifica se o email já existe
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            return "Email já cadastrado!";
        }

        // Insere novo usuário
        $query = "INSERT INTO " . $this->table_name . " SET nome=:nome, email=:email, senha=:senha";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":nome", $nome);
        $stmt->bindParam(":email", $email);
        
        // Hash da senha
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $stmt->bindParam(":senha", $hashed_password);

        if($stmt->execute()) {
            return true;
        }
        return "Erro ao cadastrar usuário!";
    }
}
?>
