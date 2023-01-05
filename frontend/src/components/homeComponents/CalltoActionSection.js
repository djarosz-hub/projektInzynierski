import React from "react";

const CalltoActionSection = () => {
    return (
        <div className="subscribe-section bg-with-black">
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="subscribe-head">
                            <h2>Do you need more tips?</h2>
                            <p>Sign up free and get the latest tips.</p>
                            <form className="form-section">
                                <input placeholder="Your Email..." 
                                name="email" 
                                type="email" 
                                onFocus={(e) => e.target.placeholder = ""}
                                onBlur={(e) => e.target.placeholder = "Your Email..."}
                                />
                                <input value="Yes. I want!" name="subscribe" type="submit" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalltoActionSection;
