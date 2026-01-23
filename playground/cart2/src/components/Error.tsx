type ErrorProps = {
    message: string;
};

function Error({ message }: ErrorProps) {
    return (
        <div className="error">
            <p>⚠️ エラーが発生しました</p>
            <p>{message}</p>
        </div>
    );
}

export default Error;