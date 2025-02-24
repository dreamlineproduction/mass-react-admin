import { getValueOrDefault } from "../../config";
import BsModal from "../others/BsModal";

const UserInfomationModal = ({ singleUser }) => {

    if (!singleUser || singleUser.length === 0) {
        return;
    }

    return (
        <BsModal
            modalId="viewMoreUserInfoModal"
            title={singleUser.name}
            size="lg"
        >
            <table style={{
                width: "calc(100% + 32px)",
                marginTop: "-17px",
                marginLeft: "-16px"
            }}
                className="table  table-striped table-hover table-bordered">
                {Object.keys(singleUser).length > 0 && (
                    <tbody>
                        <tr>
                            <th scope="row">Id:</th>
                            <td>{singleUser.id}</td>
                        </tr>
                        <tr>
                            <th scope="row">Full Name</th>
                            <td>{singleUser.name}</td>
                        </tr>
                        <tr>
                            <th scope="row">Age:</th>
                            <td>{getValueOrDefault(singleUser.age)}</td>
                        </tr>
                        <tr>
                            <th scope="row">Gender</th>
                            <td>{getValueOrDefault(singleUser.gender)}</td>
                        </tr>
                        <tr>
                            <th scope="row">User Type</th>
                            <td>{singleUser.role.name ? <span className="d-inline-flex px-2 py-1 fw-semibold text-success-emphasis bg-success-subtle border border-success-subtle rounded-2">{singleUser.role.name}</span> : 'N/A'}</td>
                        </tr>
                        {singleUser.shop_name &&
                            <tr>
                                <th scope="row">Business Name</th>
                                <td>{getValueOrDefault(singleUser.shop_name)}</td>
                            </tr>
                        }
                        <tr>
                            <th scope="row">Phone</th>
                            <td>{getValueOrDefault(singleUser.phone)}</td>
                        </tr>
                        <tr>
                            <th scope="row">State</th>
                            <td>{getValueOrDefault(singleUser.state_str)}</td>
                        </tr>
                        <tr>
                            <th scope="row">District</th>
                            <td>{getValueOrDefault(singleUser.district)}</td>
                        </tr>
                        <tr>
                            <th scope="row">City</th>
                            <td>{getValueOrDefault(singleUser.city)}</td>
                        </tr>

                        <tr>
                            <th scope="row">Area</th>
                            <td>{getValueOrDefault(singleUser.area_name)}</td>
                        </tr>
                        <tr>
                            <th scope="row">Joined Date</th>
                            <td>{getValueOrDefault(singleUser.created_at)}</td>
                        </tr>
                        <tr>
                            <th scope="row">Source</th>
                            <td>{getValueOrDefault(singleUser.source)}</td>
                        </tr>
                        <tr>
                            <th scope="row">Referral Code</th>
                            <td>{getValueOrDefault(singleUser.referral_code)}</td>
                        </tr>
                        <tr>
                            <th scope="row">Employee Code</th>
                            <td>{getValueOrDefault(singleUser.employee_code)}</td>
                        </tr>
                        <tr>
                            <th scope="row">Total Product Scanned</th>
                            <td>{getValueOrDefault(singleUser.scan_product_count, 0)}</td>
                        </tr>
                        <tr>
                            <th scope="row">Total XP</th>
                            <td>{getValueOrDefault(singleUser.total_xp, '0XP')}</td>
                        </tr>
                        <tr>
                            <th scope="row">Current XP Balance</th>
                            <td>{getValueOrDefault(singleUser.balance_xp, '0XP')}</td>
                        </tr>
                        <tr>
                            <th scope="row">Total Redeemed</th>
                            <td>{getValueOrDefault(singleUser.order_count, 0)}</td>
                        </tr>
                    </tbody>
                )}
            </table>
        </BsModal>
    );
};

export default UserInfomationModal;