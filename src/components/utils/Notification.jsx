import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function Notification() {
  const [show, setShow] = useState(true);

  return (
    <>
      <Alert className = 'bg-red-700' show={show} variant="success">
        <p>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-success">
            Close me
          </Button>
        </div>
      </Alert>

      {!show && <Button onClick={() => setShow(true)}>Show Alert</Button>}
    </>
  );
}

export default Notification;