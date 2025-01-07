import React, { useState } from 'react';
import PageTitle from "../others/PageTitle";
import videoUrl from '../../assets/img/sample-video.mp4';
import './phoneframe.scss';

const NewShort = () => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [description, setDescription] = useState('');
  const maxLength = 250;

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  return (
    <div>
      <PageTitle
        title={"Create New Short"}
        buttonLink={"/shorts/all-shorts"}
        buttonLabel={"Back to List"}
      />
      <div className="row">
        <div className="col-12 col-xl-8 col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="mb-4">
                <label className="form-label">Title*</label>
                <input
                  className={`form-control custom-input`}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter short's title"
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Description</label>
                <textarea
                  className={`form-control custom-input`}
                  id="short-description"
                  rows="2"
                  placeholder="Enter short description"
                  maxLength={maxLength}
                  value={description}
                  onChange={handleDescriptionChange}
                ></textarea>
                <div className="text-end">
                  {description.length}/{maxLength}
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Short Video/Image (Recommended Image Ratio 9:16)</label>
                <div>
                  ADD IMAGE UPLOAD HERE
                </div>
              </div>
              <div className="mb-3">
              <button type="submit" className="btn  btn-primary large-btn">Upload Short</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-4 col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="mb-4">
                <label className="form-label">Preview</label>
                <div className="notification-preview">
                            <div className="phone-frame">
                            {videoUrl ? (
                    <video width="100%" controls style={{ borderRadius: '20px' }}>
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    'Notification description will appear here.'
                  )}
                                </div>  
                            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewShort;
