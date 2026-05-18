function Header(props) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{props.title}</h1>
      <p className="text-sm text-muted-foreground">{props.description}</p>
    </div>
  )
}

export default Header