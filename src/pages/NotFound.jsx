import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div className='notfound'>
            <div className='notfound-error'>
                <span className="error-code">404</span>
                <span className='notfound-text'>Not Found</span>
            </div>
            <p>Sorry, the page you are looking for does not exist.</p>
            <Link to={'/'} className='home'>Back to home</Link>
        </div>
    )
}

export default NotFound
