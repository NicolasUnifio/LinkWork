# LinkWork

Plataforma web que conecta **freelancers** e **empresas** que desejam contratar serviços. Projeto Integrador – Unifio, grupo Alpha.

**Autores:** Nicolas Rafael Domiciano Miguel · Kauan Teixeira Poma

## Links

- Aplicação publicada: _<preencher com o link da publicação>_
- Repositório: _<preencher com o link do Git>_

## Acesso para teste

| Perfil | E-mail | Senha |
|---|---|---|
| Empresa | empresa@linkwork.com | 123456 |
| Freelancer | freelancer@linkwork.com | 123456 |

Também é possível criar contas novas na tela de cadastro.

## Funcionalidades

- Cadastro, login e recuperação de senha, com dois perfis (Empresa e Freelancer).
- Perfil editável (com foto) e perfil público; diretório "Rede" com busca e filtros.
- CRUD de projetos e de propostas, com busca, filtros e paginação.
- Fluxo principal: publicar projeto → enviar proposta → aceitar → pagar (valor em custódia; Pix com QR Code fictício de 5 minutos) → registrar versões → entregar → aprovar e liberar pagamento → avaliar.
- Chat entre a Empresa e o Freelancer contratado de cada projeto.
- Painel com 4 indicadores calculados a partir dos dados, por perfil.

Angular com NgModules (`standalone: false`) e carregamento tardio (lazy loading) das rotas, Angular Material, TypeScript, HTML e CSS/SCSS. SSR/SSG desativados.


## Documentação

- ERS (requisitos), diagrama de classes e manual de acesso e uso, entregues junto com o projeto.
