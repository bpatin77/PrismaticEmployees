const prisma = require("../prisma");
const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next({
      status: 400,
      message: "Name must be provided for a new employee.",
    });
  }
  try {
    const employee = await prisma.employee.create({ data: { name } });
    res.status(201).json(employee);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // `id` has to be converted into a number before looking for it!
    const employee = await prisma.employee.findUnique({ where: { id: +id } }); //In ThunderBolt you must add the employee id manually you're looking for after the employees/ path in the URL

    if (!name) {
      //In the thunderclient you have to make sure that the JSON tab is set up like { "name": "employeeName"} or else you will receive the error message on line 42
      return next({
        status: 400,
        message: "Name not correctly provided. Try Again!",
      });
    }

    if (employee) {
      //if there is an employee associated with the user inputted id in the URL then it will return that employee's name and id
      res.status(200).json(employee);
    } else {
      next({ status: 404, message: `Employee with id ${id} does not exist.` });
    }
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the employee exists
    const employee = await prisma.employee.findUnique({ where: { id: +id } });
    if (!employee) {
      return next({
        status: 404,
        message: `Employee with id ${id} does not exist.`,
      });
    }

    // Delete the employee
    await prisma.employee.delete({ where: { id: +id } });
    res.sendStatus(201);
  } catch (e) {
    next(e);
  }
});
