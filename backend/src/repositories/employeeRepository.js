/**
 * Data-access repository for employees.
 * Abstracts SQLite queries so the database engine (e.g. MySQL) can be swapped later.
 */
class EmployeeRepository {
  constructor(db) {
    this.db = db;
    this.findByIdentifierStmt = db.prepare(
      `SELECT id, employee_code, full_name, email, password_hash, department, role, status, created_at
       FROM employees
       WHERE LOWER(employee_code) = LOWER(?) OR LOWER(email) = LOWER(?)
       LIMIT 1`
    );
    this.findByIdStmt = db.prepare(
      `SELECT id, employee_code, full_name, email, department, role, status, created_at
       FROM employees
       WHERE id = ?
       LIMIT 1`
    );
  }

  findByIdentifier(identifier) {
    return this.findByIdentifierStmt.get(identifier, identifier) || null;
  }

  findPublicById(id) {
    return this.findByIdStmt.get(id) || null;
  }
}

module.exports = { EmployeeRepository };
