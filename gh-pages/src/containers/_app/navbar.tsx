import FileUpload from '@app/containers/_common/file-upload'
import Link from 'next/link'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { Amplitude } from '@app/utils/amplitude'

export default () => {
  return (
    <Navbar bg="light" variant="light" expand="lg" fixed="top">
      <Link href="/" as="/terraform-visual">
        <Navbar.Brand href="#">Terraform Visual</Navbar.Brand>
      </Link>

      <Navbar.Toggle />

      <Navbar.Collapse className="justify-content-end">
        <Nav className="mr-auto">
          <Link href="/" as="/terraform-visual">
            <Nav.Link href="/">Home</Nav.Link>
          </Link>

          <NavDropdown title="Examples" id="basic-nav-dropdown">
            <Link
              href="/examples/aws-s3"
              as="/terraform-visual/examples/aws-s3"
            >
              <NavDropdown.Item href="/examples/aws-s3">
                AWS S3
              </NavDropdown.Item>
            </Link>
          </NavDropdown>
        </Nav>

        <FileUpload afterUploaded={afterFileUploaded} />
      </Navbar.Collapse>
    </Navbar>
  )
}

const afterFileUploaded = () => {
  Amplitude.logEvent('upload file', { component: 'navbar' })
}
