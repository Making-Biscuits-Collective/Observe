import { Link } from 'react-router-dom';
import './Breadcrumb.scss';

const Breadcrumb = ({
    label,
    path,
    showIcon
} : {
    label: string,
    path: string,
    showIcon?: boolean
}) => (
    <div className="breadcrumb">
        <Link to={path}>{showIcon && <img src="/icon/arrow_back.svg" />} {label}</Link>
    </div>
);

export default Breadcrumb;