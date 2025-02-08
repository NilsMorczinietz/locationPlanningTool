import fw_dus_logo from '/fw_dus_logo.png';

export default function Header() {
    return (
        <header style={{display:"flex", alignItems:"center", padding:"5px"}}>
            <img src={fw_dus_logo} alt="Logo" width="auto" height="90%" />
        </header>
    );
}