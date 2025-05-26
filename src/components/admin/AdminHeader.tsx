
interface AdminHeaderProps {
  title: string;
  description: string;
}

const AdminHeader = ({ title, description }: AdminHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default AdminHeader;
