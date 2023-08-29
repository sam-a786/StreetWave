import "./NotFound.css";

export default function TokenError() {
  return (
    <section className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1  text-center">
              <div className="four_zero_four_bg"></div>
              <div className="content_box_404">
                <h3 className="h2">Link Invalid</h3>
                <p>Link is not valid, please request a new one</p>
              </div>
              <div className="button">
                <a href="/" className="link_404">
                  Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
