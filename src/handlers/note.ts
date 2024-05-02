import prisma from "../db";

export const getNotes = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      notes: true,
    },
  });

  res.json({ data: user.notes });
};

export const getNoteInvites = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      invites: true,
    },
  });

  res.json({ data: user.invites });
};

export const createNote = async (req, res, next) => {
  try {
    const note = await prisma.note.create({
      data: {
        title: req.body.title,
        belongsToId: req.user.id,
        members: {
          connect: { id: req.user.id },
        },
      },
    });
    res.json({ data: note });
  } catch (e) {
    next(e);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const note = await prisma.note.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
        status: req.body.status,
      },
    });
    res.json({ data: note });
  } catch (e) {
    next(e);
  }
};

export const inviteUser = async (req, res, next) => {
  try {
    const note = await prisma.note.update({
      where: {
        id: req.params.id,
      },
      data: {
        invited: {
          connect: { id: req.body.userid },
        },
      },
    });
    const user = await prisma.user.update({
      where: {
        id: req.body.userid,
      },
      data: {
        invites: {
          connect: { id: req.params.id },
        },
      },
    });
    res.json({ data: { note, user } });
  } catch (e) {
    next(e);
  }
};

export const acceptInvite = async (req, res, next) => {
  try {
    const note = await prisma.note.update({
      where: {
        id: req.params.id,
      },
      data: {
        invited: {
          disconnect: { id: req.body.userid },
        },
        members: {
          connect: { id: req.body.userid },
        },
      },
    });

    const user = await prisma.user.update({
      where: {
        id: req.body.userid,
      },
      data: {
        invites: {
          disconnect: { id: req.params.id },
        },
        notes: {
          connect: { id: req.params.id },
        },
      },
    });
    res.json({ data: { note, user } });
  } catch (e) {
    next(e);
  }
};

export const declineInvite = async (req, res, next) => {
  try {
    const note = await prisma.note.update({
      where: {
        id: req.params.id,
      },
      data: {
        invited: {
          disconnect: { id: req.body.userid },
        },
      },
    });

    const user = await prisma.user.update({
      where: {
        id: req.body.userid,
      },
      data: {
        invites: {
          disconnect: { id: req.params.id },
        },
      },
    });
    res.json({ data: { note, user } });
  } catch (e) {
    next(e);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: req.params.id },
      include: { members: true },
    });

    await Promise.all(
      note.members.map(async (user) => {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            notes: {
              disconnect: { id: req.params.id },
            },
          },
        });
      })
    );

    await prisma.note.delete({
      where: { id: req.params.id },
    });
    res.json({ data: { note } });
  } catch (e) {
    next(e);
  }
};
