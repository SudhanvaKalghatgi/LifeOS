import { Task } from "./task.model.js";

/**
 * Create Task
 */
export const createTask = async ({ userId, payload }) => {
  return Task.create({
    userId,
    ...payload,
  });
};

/**
 * Find one task by id + userId (ownership check)
 */
export const findTaskById = async ({ userId, taskId }) => {
  return Task.findOne({ _id: taskId, userId });
};

/**
 * Update task by id + userId
 */
export const updateTaskById = async ({ userId, taskId, payload }) => {
  return Task.findOneAndUpdate(
    { _id: taskId, userId },
    { $set: payload },
    { new: true, runValidators: true }
  );
};

/**
 * List tasks with filters + pagination
 */
export const listTasks = async ({ userId, filters, options }) => {
  const query = { userId };

  // default: don't show archived unless asked
  query.isArchived = filters.isArchived ?? false;

  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;

  // Overdue: dueDate < now & not done
  if (filters.overdue) {
    query.dueDate = { $lt: new Date() };
    query.status = { $ne: "done" };
    query.isArchived = false;
  } else if (filters.from || filters.to) {
    // dueDate range (mutually exclusive with overdue)
    query.dueDate = {};
    if (filters.from) query.dueDate.$gte = new Date(filters.from);
    if (filters.to) query.dueDate.$lte = new Date(filters.to);
  }

  // Search (title + description)
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
    ];
  }

  const page = Math.max(options.page || 1, 1);
  const limit = Math.min(Math.max(options.limit || 10, 1), 50);
  const skip = (page - 1) * limit;

  // Sorting
  const sortOrder = options.sortOrder === "asc" ? 1 : -1;
  let sort = { createdAt: -1 };

  if (options.sortBy === "dueDate") sort = { dueDate: sortOrder, createdAt: -1 };
  if (options.sortBy === "createdAt") sort = { createdAt: sortOrder };
  if (options.sortBy === "priority") sort = { priority: sortOrder, createdAt: -1 };

  const [tasks, total] = await Promise.all([
    Task.find(query).sort(sort).skip(skip).limit(limit),
    Task.countDocuments(query),
  ]);

  return {
    tasks,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
