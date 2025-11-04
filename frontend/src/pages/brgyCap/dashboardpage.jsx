import React from 'react';

const BC_DashboardPage = () => {
  return (
    <div>
        <div className=''>
            <h1>Welcome to your dashboard, Kapitan!</h1>
            <p>Himuon taning dasdfasdfasd</p>
            <div>
                <p>Barangay Captian:</p>
                <p>Jose P. Riizzal</p>
            </div>
        </div>

        <div>
            {/* right */}
            <div>
                <div>
                    CARDS
                </div>
                <div>
                    <div>
                        Stats for case type
                    </div>
                    <div>
                        PIE CHART
                    </div>
                </div>
            </div>

            {/* LEFT */}
            <div>
                <div>
                    urgent
                </div>
                <div>
                    officils
                </div>
            </div>
        </div>
    </div>
  );
}

export default BC_DashboardPage;