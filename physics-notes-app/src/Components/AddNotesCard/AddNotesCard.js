import React from "react";

export default class AddNotesCard extends React.Component {

    render() {
        return(
            <div>
                <section className="vh-75">
                <div className="container pt-5 vh-75">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-10">
                    <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }} >
                        <div className="card-body p-5 text-center">
                        <div className="mb-md-2 mt-md-3 pb-5">
                            <h2 className="fw-bold mb-2 text-uppercase">Add Post</h2>
                            <p className="text-white-50 mb-5">Add Post to</p>

                            <div className="form-outline form-white mb-4">
                            <label className="form-label">Lesson Title</label>
                            </div>

                            <div className="form-outline form-white mb-4">
                            <label className="form-label">Lesson Date</label>
                            </div>
                            
                            <div className="mb-4">
                            </div>

                            <button className="btn btn-lg px-5 btn-success mb-2" type="submit" name="add" value="1">Add</button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                </section>
            </div>
        );
    }

}