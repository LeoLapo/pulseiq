function Header() {
  return (
    <header className="[grid-area:header] bg-bg-secondary p-4 flex justify-between items-center border-b border-border-color">
      <h1 className="text-xl font-semibold text-text-primary">
        Microserviços para Acompanhamento de Ações
      </h1>
      <nav className="flex gap-2">
        <a href="#" className="text-text-secondary px-2 py-1 rounded hover:bg-bg-tertiary hover:text-text-primary transition">
          Dashboard
        </a>
        <a href="#" className="text-text-secondary px-2 py-1 rounded hover:bg-bg-tertiary hover:text-text-primary transition">
          Portfólio
        </a>
        <a href="#" className="text-text-secondary px-2 py-1 rounded hover:bg-bg-tertiary hover:text-text-primary transition">
          Configurações
        </a>
      </nav>
    </header>
  );
}

  export default Header;