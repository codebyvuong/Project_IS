const bcrypt = require('bcrypt');
const { AppError } = require('../utils/errors');

// Precomputed dummy hash to keep timing consistent when user is not found
const DUMMY_BCRYPT_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKxGhu5u1rQ2Q3Q4Q5Q6Q7Q8Q9Q0QaQbQcQdO';

function toPublicEmployee(employeeRow) {
  return {
    id: employeeRow.id,
    employeeCode: employeeRow.employee_code,
    name: employeeRow.full_name,
    email: employeeRow.email,
    department: employeeRow.department,
    role: employeeRow.role,
    status: employeeRow.status,
    createdAt: employeeRow.created_at,
  };
}

class AuthService {
  constructor(employeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  async authenticate(identifier, password) {
    const employee = this.employeeRepository.findByIdentifier(identifier);
    const hashToCheck = employee ? employee.password_hash : DUMMY_BCRYPT_HASH;
    const isMatch = await bcrypt.compare(password, hashToCheck);

    if (!employee || !isMatch) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid employee ID/email or password.');
    }

    if (employee.status !== 'ACTIVE') {
      throw new AppError(403, 'ACCOUNT_INACTIVE', 'Your account is currently inactive. Please contact support.');
    }

    return toPublicEmployee(employee);
  }

  getAuthenticatedProfile(employeeId) {
    const employee = this.employeeRepository.findPublicById(employeeId);
    if (!employee || employee.status !== 'ACTIVE') {
      throw new AppError(401, 'UNAUTHORIZED', 'Authentication required.');
    }
    return toPublicEmployee(employee);
  }
}

module.exports = { AuthService, toPublicEmployee };
